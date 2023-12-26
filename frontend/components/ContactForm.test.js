import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';
import App from '../App.js'

test('renders without errors', () => {
    render(<App />);

});

test('renders the contact form header', () => {
    render(<App />);
    const header = screen.getByRole(/heading/i);

    expect(header).toBeInTheDocument();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<App />); 
    const firstTextBox = screen.getByPlaceholderText('Edd');
    userEvent.type(firstTextBox, '1234');
    expect(firstTextBox).toHaveValue('1234');
    const errors = screen.getByText('Error: firstName must have at least 5 characters.');
    expect(errors).toBeTruthy();    
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<App />); 
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    await waitFor(() => {
        const errors = screen.queryAllByTestId('error');
        expect(errors.length).toBe(3);

    });
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<App />);
    //first name
    const firstName = screen.getByPlaceholderText('Edd');
    userEvent.type(firstName, 'beaner');
    //last name
    const lastName = screen.getByPlaceholderText('Burke');
    userEvent.type(lastName, 'beaner');
    const button = screen.getByRole('button');
    userEvent.click(button);
    await waitFor(() => {
        const errors = screen.queryAllByTestId('error');
        expect(errors.length).toBe(1);
    });

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<App />);
    const emailField = screen.getByLabelText('Email*');
    userEvent.type(emailField, 'warren@gmail');

    const error = await screen.findByText('Error: email must be a valid email address.');
    expect(error).toBeInTheDocument();

});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<App />);
    const firstName = screen.getByPlaceholderText('Edd');
    userEvent.type(firstName, 'beaner');

    const emailField = screen.getByLabelText('Email*');
    userEvent.type(emailField, 'warren@gmail.com');

    const button = screen.getByRole('button');
    userEvent.click(button);

    const error = screen.getByText('Error: lastName is a required field.');
    expect(error).toBeTruthy;

});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {

    render(<App />);
    const firstName = screen.getByPlaceholderText('Edd');
    userEvent.type(firstName, 'beaner');

    const lastName = screen.getByPlaceholderText('Burke');
    userEvent.type(lastName, 'beaner');

    const emailField = screen.getByLabelText('Email*');
    userEvent.type(emailField, 'warren@gmail.com');

    userEvent.click(screen.getByRole('button'));

    expect(screen.queryByTestId('messageDisplay')).toBeFalsy();

});

test('renders all fields text when all fields are submitted.', async () => {
    render(<App />);

    const firstName = screen.getByPlaceholderText('Edd');
    userEvent.type(firstName, 'beaner');

    const lastName = screen.getByPlaceholderText('Burke');
    userEvent.type(lastName, 'both');

    const emailField = screen.getByLabelText('Email*');
    userEvent.type(emailField, 'warren@gmail.com');

    const messageField = screen.getByLabelText('Message');
    userEvent.type(messageField, 'beaner boy');

    userEvent.click(screen.getByRole('button'));

    const displayedFirstName = screen.queryByText('beaner');
    const displayedLastName = screen.queryByText('both');
    const displayedEmail = screen.queryByText('warren@gmail.com');
    const displayedMessage = screen.queryByText('beaner boy');

    expect(displayedFirstName).toBeInTheDocument();
    expect(displayedLastName).toBeInTheDocument();
    expect(displayedEmail).toBeInTheDocument();
    expect(displayedMessage).toBeInTheDocument();

});
