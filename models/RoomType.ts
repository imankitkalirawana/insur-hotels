import { RoomType as IRoomType } from '@/lib/interface';
import mongoose, { Model } from 'mongoose';
import slugify from 'slugify';

const roomTypeSchema = new mongoose.Schema<IRoomType>(
  {
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    rid: {
      type: String,
      unique: true
    },
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

roomTypeSchema.pre('save', function (next) {
  this.rid = slugify(this.name, { lower: true });
  next();
});

const RoomType: Model<IRoomType> =
  mongoose.models.RoomType || mongoose.model('RoomType', roomTypeSchema);

export default RoomType;
