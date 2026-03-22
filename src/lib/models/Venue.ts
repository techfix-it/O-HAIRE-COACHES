import mongoose, { Schema, Document } from 'mongoose';

export interface IVenue extends Document {
  name: string;
  address?: string;
  city?: string;
  image?: string;
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
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Em Next.js hot reload, precisamos garantir que o Mongoose recarregue o modelo se houver mudança no esquema
if (mongoose.models.Venue && !mongoose.models.Venue.schema.paths.image) {
  delete mongoose.models.Venue;
}

export const Venue = mongoose.models.Venue || mongoose.model<IVenue>('Venue', venueSchema);
