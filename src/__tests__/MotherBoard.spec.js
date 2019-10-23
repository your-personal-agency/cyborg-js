// @flow
import MotherBoard from '../MotherBoard';
import ComponentMock from './__mocks__/ComponentMock';

let motherboard: MotherBoard;

const createView = () => {
  window.document.body.innerHTML = '<div data-component="test"></div>';
};

beforeAll(() => {
  motherboard = MotherBoard.getInstance();
  motherboard.componentsMap = { 'test': ComponentMock };
  createView();
});

test('MotherBoard is singleton', () => {
  expect(motherboard).toBeInstanceOf(MotherBoard);
  expect(() => {
    new MotherBoard();
  }).toThrow(/MotherBoard.getInstance()/);
});

test('MotherBoard responds on DOMContentLoaded', () => {
  const mbBind: function = jest.spyOn(motherboard, 'bind');
  const mbBuild: function = jest.spyOn(motherboard, 'build');
  document.dispatchEvent(new Event('DOMContentLoaded'));

  expect(mbBind).toHaveBeenCalledTimes(1);
  expect(mbBuild).toHaveBeenCalledTimes(1);
});

test('MotherBoard registers Notifications', () => {
  const cMock = new ComponentMock();
  motherboard.registerNotification({
    name: 'test',
    notifications: '',
    classRef: cMock
  });
});

test('MotherBoard responds on window.onload', () => {
  const onload: function = jest.spyOn(motherboard, 'onload');
  window.dispatchEvent(new Event('load'));
  expect(onload).toHaveBeenCalledTimes(1);
});

