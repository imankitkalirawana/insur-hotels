interface Base {
  _id: string;
  addedBy: string;
  modifiedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends Base {
  email: string;
  phone: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  status: 'active' | 'banned' | 'deleted';
  src: string;
}

export interface Hotel extends Base {
  pageTitle: string;
  keywords: string;
  metaDescription: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  slug: string;
  src: string;
  url: string;
  og: string;
  instagram: string;
  bannerText: string;
  bannerImg: string;
  averageRating: string;
  banner: Banner;
  offers: Offer[];
  gallery: {
    src: string;
    preview: string;
    file: File;
    _id: string;
  }[];
  premiumFacilities: Facilities[];
  otherFacilities: Facilities[];
  status: 'open' | 'closed' | 'maintainance';
  location: string;
  whenToVisit: WhenToVisit;
  howToGetThere: HowToGetThere;
  thingsToDo: ThingsToDo;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface WhenToVisit {
  text: string;
  timing: {
    _id: string;
    title: string;
    description: string;
  }[];
}

export interface HowToGetThere {
  text: string;
  location: string;
}

export interface ThingsToDo {
  text: string;
  activities: {
    _id: string;
    title: string;
    description: string;
    src: string;
  }[];
}

export interface Facilities {
  name: string;
  description: string;
  src: string;
  preview: string;
  file: File;
  _id: string;
}

export interface Banner {
  text: string;
  src: string;
}

export interface Room extends Base {
  hotelId: string; // slug
  title: string;
  description: string;
  price: number;
  size: number; //in sqft
  discount: {
    type: 'percentage' | 'amount';
    value: number;
  };
  maxGuests: number;
  type: string;
  available: boolean;
  amenities: string[];
  images: [
    {
      src: string;
      preview: string;
      file: File;
      _id: string;
    }
  ];
  popularWithGuests: string[];
  roomFeatures: string[];
  safetyFeatures: string[];
  bathroomFeatures: string[];
  otherFeatures: string[];
  reviews: {
    guestId: string;
    rating: number;
    comment: string;
  }[];
}

export interface RoomType extends Base {
  name: string;
  rid: string;
}
export interface Website extends Base {
  pageTitle: string;
  keywords: string;
  metaDescription: string;
  name: string;
  description: string;
  url: string;
  og: string;
  logo: string;
  email: string;
  phone: string;
  banner: {
    preText: string;
    heading: string;
    text: string;
    images: [
      {
        src: string;
        preview: string;
        file: File;
      }
    ];
  };
  about: About;
  facilities: Facilities[];
  socials: Socials[];
  testimonials: Testimonial[];
  instagrammableMoment: InstagrammableMoment;
}

interface InstagrammableMoment {
  video: {
    src: string;
    file: File;
    preview: string;
  };
  text: string;
  url: string;
}

export interface About {
  shortDescription: string;
  longDescription: string;
}

export interface Socials {
  name: string;
  src: string;
  url: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  src: string;
  comment: string;
  preview: string;
  file: File;
}

export interface Offer {
  _id: string;
  title: string;
  discount: string;
  startDate: string;
  endDate: string;
  src: string;
  preview: string;
  file: File;
}

export interface Newsletter extends Base {
  email: string;
}
