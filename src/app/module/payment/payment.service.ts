/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes'
import AppError from '../../errors/AppError'
import axios from 'axios'
import { TPayment } from './payment.interface'

const initPayment = async (payload: TPayment) => {
  try {
    const paymentInfo = {
      store_id: 'aamarpaytest',
      success_url: 'https://car-cleanify.netlify.app/success',
      fail_url: 'https://car-cleanify.netlify.app/failed',
      cancel_url: 'https://car-cleanify.netlify.app/cancelled',
      currency: 'BDT',
      signature_key: 'dbb74894e82415a2f7ff0ec3a97e4183',
      desc: 'Merchant Registration Payment',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1206',
      cus_country: 'Bangladesh',
      type: 'json',
      ...payload,
    }
    const res = await axios.post(
      'https://sandbox.aamarpay.com/jsonpost.php',
      paymentInfo,
    )
    if (res.data && res.data.result) {
      return res.data
    } else {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Payment failed')
    }
  } catch (error: any) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message || 'An error occurred during the payment process',
    )
  }
}

export const paymentServices = {
  initPayment,
}
