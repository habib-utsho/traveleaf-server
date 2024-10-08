type TPackage = {
  name: 'Basic' | 'Standard' | 'Premium'
  description: string
  price: number
  durationInMonths: number
  currencyType: 'BDT' | 'USD' | 'EUR'
  isDeleted: boolean
}

export { TPackage }
