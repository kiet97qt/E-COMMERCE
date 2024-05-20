"use strict";

const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "template";
const COLLECTION_NAME = "templates";
// Declare the Schema of the Mongo model
const templateSchema = new Schema(
  {
    temp_id: { type: Number, required: true },
    temp_name: { type: String, required: true },
    temp_status: { type: String, default: "active" },
    temp_html: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, templateSchema);
