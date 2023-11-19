export const ListingSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    address: {
      type: 'object',
      properties: {
        street: { type: 'string' },
        city: { type: 'string' },
        country: { type: 'string' }
      },
      required: ['street', 'city', 'country']
    },
    price: { type: 'number', minimum: 1 },
    thumbnail: { type: 'string' },
    metadata: {
      type: 'object',
      properties: {
        bathroomNum: { type: 'number', minimum: 1 },
        propertyType: { type: 'string' },
        totalBedNum: { type: 'number', minimum: 1 },
        bedrooms: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              bedNum: { type: 'number', minimum: 1 },
              bedType: { type: 'string' }
            },
            required: ['bedNum', 'bedType']
          }
        },
        amenities: {
          type: 'array',
          items: { type: 'string' }
        }
      },
      required: ['bathroomNum', 'propertyType', 'totalBedNum', 'bedrooms', 'amenities']
    }
  },
  required: ['title', 'address', 'price', 'thumbnail', 'metadata']
};
