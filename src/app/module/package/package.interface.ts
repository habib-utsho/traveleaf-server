type TPackage = {
  name:
    | 'Basic'
    | 'Standard'
    | 'Premium'
    | 'Explorer'
    | 'Backpacker'
    | 'Adventurer'
  shortBio: string
  description: string
  price: number
  durationInMonths: number
  benefits: string[]
  currencyType: 'BDT' | 'USD' | 'EUR'
  isDeleted: boolean
}

export { TPackage }
