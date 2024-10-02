type TPackage = {
  name: 'Basic' | 'Standard' | 'Premium'
  price: number
  durationInMonths: number
  currencyType: 'BDT' | 'USD' | 'EUR'
  isDeleted: boolean
}

export { TPackage }
