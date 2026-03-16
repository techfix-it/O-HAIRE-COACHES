import mongoose, { Schema, Document } from 'mongoose';
import './Venue';
import './BusRoute';
import './PickupLocation';

export interface IEvent extends Document {
  title: string;
  date: Date;
  venue: mongoose.Types.ObjectId;
  description?: string;
  imageUrl?: string;
  price: number;
}

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    venue: {
      type: Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for populated routes
eventSchema.virtual('routes', {
  ref: 'BusRoute',
  localField: '_id',
  foreignField: 'event',
});

export const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);
