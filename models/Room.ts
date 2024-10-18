import { Room as RoomInterface } from '@/lib/interface';
import mongoose, { Model } from 'mongoose';

const roomSchema = new mongoose.Schema<RoomInterface>(
  {
    hotelId: String,
    title: String,
    description: String,
    price: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      default: 0
    },
    discount: {
      type: {
        type: String,
        default: 'percentage'
      },
      value: {
        type: Number,
        default: 0
      }
    },
    amenities: [String],
    maxGuests: Number,
    type: String,
    images: [
      {
        src: String
      }
    ],
    available: {
      type: Boolean,
      default: true
    },
    popularWithGuests: [String],
    roomFeatures: [String],
    safetyFeatures: [String],
    bathroomFeatures: [String],
    otherFeatures: [String],
    reviews: [
      {
        guestId: String,
        rating: Number,
        comment: String
      }
    ],
    addedBy: {
      type: String,
      default: 'unknown'
    },
    modifiedBy: {
      type: String,
      default: 'unknown'
    }
  },
  {
    timestamps: true
  }
);

const Room: Model<RoomInterface> =
  mongoose.models.Room || mongoose.model('Room', roomSchema);

export default Room;
