import mongoose, { Schema, Document } from 'mongoose';

export interface IVenue extends Document {
  name: string;
  address?: string;
  city?: string;
}

const venueSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Venue = mongoose.models.Venue || mongoose.model<IVenue>('Venue', venueSchema);
