import sinon, { SinonStubbedInstance } from 'sinon';
import { Bring } from '../../src/bring';

const mocks = {
  getLists: sinon.stub(),
  getItems: sinon.stub(),
  getItemsDetails: sinon.stub(),
  addItemToList: sinon.stub(),
  removeItemFromList: sinon.stub(),
  getAllUsersFromList: sinon.stub(),
  login: sinon.stub(),
};

export const resetBringMock = () => {
  mocks.getLists.reset();
  mocks.getItems.reset();
  mocks.getItemsDetails.reset();
  mocks.addItemToList.reset();
  mocks.removeItemFromList.reset();
  mocks.getAllUsersFromList.reset();
  mocks.login.reset();
};

export const bringMock = {
  getLists: mocks.getLists,
  getItems: mocks.getItems,
  getItemsDetails: mocks.getItemsDetails,
  addItemToList: mocks.addItemToList,
  removeItemFromList: mocks.removeItemFromList,
  getAllUsersFromList: mocks.getAllUsersFromList,
  login: mocks.login,
} as unknown as SinonStubbedInstance<Bring>;
