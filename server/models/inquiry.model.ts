import mongoose, { Schema, type HydratedDocument, type InferSchemaType } from 'mongoose'

const inquirySchema = new Schema(
  {
    ticketNumber: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['open', 'responded', 'resolved'],
      default: 'open',
      index: true,
    },
    respondedAt: { type: Date, default: null },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

export type InquiryDocument = HydratedDocument<InferSchemaType<typeof inquirySchema>>

export const Inquiry = mongoose.model('Inquiry', inquirySchema)
