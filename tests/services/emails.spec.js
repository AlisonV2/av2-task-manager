import nodemailer from 'nodemailer';
import EmailService from '../../src/services/EmailService';

const sendMailMock = jest
  .fn()
  .mockReturnValue('Message sent to: test@test.com');

jest.mock('nodemailer');
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

beforeEach(() => {
  sendMailMock.mockClear();
  nodemailer.createTransport.mockClear();
});

describe('Email Service', () => {
  test('Should create transporter', async () => {
    EmailService.createTransporter();
    expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);
  });

  test('Should send mail', async () => {
    const token = 'test';
    const email = 'test@test.com';
    const result = await EmailService.sendMail(token, email);
    expect(sendMailMock).toHaveBeenCalled();
    expect(result).toBe('Message sent to: test@test.com');
  });

  test('Should throw an error when failing to send email', async () => {
    try {
      await EmailService.sendMail();
    } catch (err) {
      expect(err.message).toBe('Email is required');
    }
  });
});
