import mongoose, { Schema, Document } from 'mongoose';

export interface IBusRoute extends Document {
  event: mongoose.Types.ObjectId;
  pickupLocation: mongoose.Types.ObjectId;
  departureTime: string;
  price: number;
  capacity: number;
  booked: number;
}

const busRouteSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true, // Will update when event changes
    },
    pickupLocation: {
      type: Schema.Types.ObjectId,
      ref: 'PickupLocation',
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    booked: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const BusRoute = mongoose.models.BusRoute || mongoose.model<IBusRoute>('BusRoute', busRouteSchema);
