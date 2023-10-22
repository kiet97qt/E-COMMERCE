"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const Comment = require("../models/comment.model");
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");
const {
  findAllProducts,
  getProductById,
  findProduct,
} = require("../models/repositories/product.repo");
const { convertToObjectMongodb } = require("../utils");
class CommentService {
  static async createComment({
    userId,
    productId,
    content,
    parentCommentId = null,
  }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parent: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      //reply comment
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError("parent comment not found");

      rightValue = parentComment.comment_right;

      await Comment.updateMany(
        {
          comment_productId: convertToObjectMongodb(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );

      await Comment.updateMany(
        {
          comment_productId: convertToObjectMongodb(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await Comment.findOne(
        {
          comment_productId: convertToObjectMongodb(productId),
        },
        "comment_right",
        {
          sort: {
            comment_right: -1,
          },
        }
      );
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offet = 0,
  }) {
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent) throw new NotFoundError("Not found comment for product");

      const comments = await Comment.find({
        comment_productId: convertToObjectMongodb(productId),
        comment_left: {
          $gt: parent.comment_content,
        },
        comment_right: {
          $lte: parent.comment_right,
        },
      })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({
          comment_left: 1,
        });

      return comments;
    }

    const comments = await Comment.find({
      comment_productId: convertToObjectMongodb(productId),
      comment_parentId: parentCommentId,
    })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({
        comment_left: 1,
      });

    return comments;
  }

  static async deleteComment({ commentId, productId }) {
    // check the product exists in the database
    const foundProduct = await findProduct({ product_id: productId });

    if (!foundProduct) throw new NotFoundError("product not found");
    //1. Xac dinh gia tri left vs right of commentId
    const comment = await Comment.findById(commentId);
    if (!comment) throw new NotFoundError("Comment not found");
    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;
    //2. tinh width
    const width = rightValue - leftValue + 1;
    //3. Xoa tat ca commentId con
    await Comment.deleteMany({
      comment_parent: convertToObjectMongodb(productId),
      comment_left: { $gte: leftValue, $lte: rightValue },
    });
    //4. cap nhat gia tri left, right con lai
    await Comment.updateMany(
      {
        comment_productId: convertToObjectMongodb(productId),
        comment_right: { $gt: rightValue },
      },
      {
        $inc: { comment_right: -width },
      }
    );

    await Comment.updateMany(
      {
        comment_productId: convertToObjectMongodb(productId),
        comment_left: { $gt: rightValue },
      },
      {
        $inc: { comment_left: -width },
      }
    );

    return true;
  }
}

module.exports = CommentService;
