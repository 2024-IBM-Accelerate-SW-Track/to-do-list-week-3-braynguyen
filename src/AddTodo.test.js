import { render, screen, fireEvent } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});




test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);
  // create a task
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });
  const dueDate = "05/30/2023";
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  // try to create an identical task
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  // make sure there is only one on screen
  const check = screen.getAllByText(/History Test/i);
  expect(check.length).toEqual(1);
});

test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  // put date without a name
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });
  const dueDate = "05/30/2023";
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  // check that there is nothing on the DOM with the date
  const checkDate = screen.queryByText(new RegExp(dueDate, "i"));
  expect(checkDate).not.toBeInTheDocument();
});

test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  // put a name only
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const element = screen.getByRole('button', { name: /Add/i });
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.click(element);

  // check that there is nothing on the DOM with the name
  const check = screen.queryByText(/History Test/i);
  expect(check).not.toBeInTheDocument();
});



test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
  // create a task
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "05/30/2023";
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);

  // make sure it exists (having problems with checking date)
  const check = screen.getByText(/History Test/i);
  expect(check).toBeInTheDocument();

  // delete task
  const deleteTask = screen.getByRole("checkbox");
  fireEvent.click(deleteTask);

  // check task no longer exists
  const checkDeleted = screen.queryByText(/History Test/i);
  const checkDateDeleted = screen.queryByText(new RegExp(dueDate, "i"));
  expect(checkDeleted).not.toBeInTheDocument();
  expect(checkDateDeleted).not.toBeInTheDocument();

});


test('test that App component renders different colors for past due events', () => {
  render(<App />);
  //  create a future task
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const futureDueDate = "05/30/2025";
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: futureDueDate}});
  fireEvent.click(element);

  // create an out of date task
  const pastDueDate = "05/30/2023";
  fireEvent.change(inputTask, { target: { value: "Math Test"}});
  fireEvent.change(inputDate, { target: { value: pastDueDate}});
  fireEvent.click(element);

  // make sure they both exists
  const futureCheck = screen.getByTestId(/History Test/i);
  expect(futureCheck).toBeInTheDocument();
  const pastCheck = screen.getByTestId(/Math Test/i);
  expect(pastCheck).toBeInTheDocument();

  // check that they have different colors
  const futureColor = futureCheck.style.backgroundColor;
  const pastColor = pastCheck.style.backgroundColor;
  expect(futureColor).not.toBe(pastColor);
});
