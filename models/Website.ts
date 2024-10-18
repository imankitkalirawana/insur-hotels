import mongoose, { Model } from 'mongoose';
import { Website as WebsiteInterface } from '@/lib/interface';

const websiteSchema = new mongoose.Schema<WebsiteInterface>(
  {
    pageTitle: String,
    keywords: String,
    metaDescription: String,
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    description: String,
    url: {
      type: String,
      required: [true, 'Url is required']
    },
    logo: String,
    email: String,
    phone: String,
    og: String,
    banner: {
      preText: String,
      heading: String,
      text: String,
      images: [{ src: String }]
    },
    about: {
      shortDescription: String,
      longDescription: String
    },
    facilities: [
      {
        name: String,
        description: String,
        src: String
      }
    ],
    socials: [
      {
        name: String,
        src: String,
        url: String
      }
    ],
    instagrammableMoment: {
      video: {
        src: String
      },
      text: String,
      url: String
    },
    testimonials: [
      {
        name: String,
        src: String,
        comment: String
      }
    ],
    addedBy: {
      type: String,
      default: '-'
    },
    modifiedBy: {
      type: String,
      default: '-'
    }
  },
  {
    timestamps: true
  }
);

const Website: Model<WebsiteInterface> =
  mongoose.models.Website || mongoose.model('Website', websiteSchema);

export default Website;
