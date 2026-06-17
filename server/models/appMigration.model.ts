import mongoose, { type Document, Schema } from 'mongoose'

export interface IAppMigration extends Document {
  name: string
  ranAt: Date
}

const appMigrationSchema = new Schema<IAppMigration>(
  {
    name: { type: String, required: true, unique: true },
    ranAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
)

export const AppMigration = mongoose.model<IAppMigration>('AppMigration', appMigrationSchema)
