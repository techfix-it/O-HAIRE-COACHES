import mongoose, { Schema, Document } from 'mongoose';

export interface IPickupLocation extends Document {
  name: string;
  description?: string;
  price: number;
  time?: string;
  venue: mongoose.Types.ObjectId;
}

const pickupLocationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    time: {
      type: String,
      default: '',
    },
    venue: {
      type: Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PickupLocation = mongoose.models.PickupLocation || mongoose.model<IPickupLocation>('PickupLocation', pickupLocationSchema);
