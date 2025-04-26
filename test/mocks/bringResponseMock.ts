export const mockListsResponse = {
  lists: [
    {
      listUuid: 'list-1',
      name: 'Groceries',
      theme: 'default',
    },
    {
      listUuid: 'list-2',
      name: 'Hardware Store',
      theme: 'blue',
    },
  ],
};

export const mockItemsResponse = {
  uuid: 'user-123',
  status: 'ok',
  purchase: [
    { specification: '2 lbs', name: 'Apples' },
    { specification: '1 carton', name: 'Milk' },
    { specification: '', name: 'Bread' },
  ],
  recently: [
    { specification: '', name: 'Eggs' },
    { specification: '', name: 'Cheese' },
  ],
};

export const mockItemsDetailsResponse = [
  {
    uuid: 'item-1',
    itemId: 'apple',
    listUuid: 'list-1',
    userIconItemId: 'fruit',
    userSectionId: 'produce',
    assignedTo: 'user-123',
    imageUrl: 'https://example.com/apple.jpg',
  },
  {
    uuid: 'item-2',
    itemId: 'milk',
    listUuid: 'list-1',
    userIconItemId: 'dairy',
    userSectionId: 'refrigerated',
    assignedTo: '',
    imageUrl: 'https://example.com/milk.jpg',
  },
];

export const mockUsersResponse = {
  users: [
    {
      publicUuid: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      photoPath: '',
      pushEnabled: true,
      plusTryOut: false,
      country: 'US',
      language: 'en',
    },
    {
      publicUuid: 'user-456',
      name: 'Another User',
      email: 'another@example.com',
      photoPath: '',
      pushEnabled: false,
      plusTryOut: false,
      country: 'UK',
      language: 'en',
    },
  ],
};
