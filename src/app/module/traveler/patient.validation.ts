import { z } from 'zod'

const createTravelerZodSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email format.'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters long.')
    .regex(/^\d+$/, 'Phone number must contain only digits.'),
  bio: z.string().min(1, 'Bio is required.'),
  gender: z.enum(['Male', 'Female', 'Other'], {
    required_error: 'Gender is required.',
  }),
  district: z.enum(
    [
      'Dhaka',
      'Faridpur',
      'Gazipur',
      'Gopalganj',
      'Jamalpur',
      'Kishoreganj',
      'Madaripur',
      'Manikganj',
      'Munshiganj',
      'Mymensingh',
      'Narayanganj',
      'Narsingdi',
      'Netrokona',
      'Rajbari',
      'Shariatpur',
      'Sherpur',
      'Tangail',
      'Bogra',
      'Joypurhat',
      'Naogaon',
      'Natore',
      'Chapainawabganj',
      'Pabna',
      'Rajshahi',
      'Sirajganj',
      'Dinajpur',
      'Gaibandha',
      'Kurigram',
      'Lalmonirhat',
      'Nilphamari',
      'Panchagarh',
      'Rangpur',
      'Thakurgaon',
      'Barguna',
      'Barishal',
      'Bhola',
      'Jhalokati',
      'Patuakhali',
      'Pirojpur',
      'Bandarban',
      'Brahmanbaria',
      'Chandpur',
      'Chattogram',
      'Cumilla',
      "Cox's Bazar",
      'Feni',
      'Khagrachari',
      'Lakshmipur',
      'Noakhali',
      'Rangamati',
      'Habiganj',
      'Moulvibazar',
      'Sunamganj',
      'Sylhet',
      'Bagerhat',
      'Chuadanga',
      'Jessore',
      'Jhenaidah',
      'Khulna',
      'Kushtia',
      'Magura',
      'Meherpur',
      'Narail',
      'Satkhira',
    ],
    { required_error: 'District is required.' },
  ),
  dateOfBirth: z
    .string({ required_error: 'Date of birth is required.' })
    .refine((value) => !isNaN(Date.parse(value)), {
      message: 'Invalid date format.',
    }),
  profileImg: z.string().optional(), // Optional field for profile image
  postsCount: z.number().optional().default(0), // Optional field, default to 0
  followers: z.array(z.string()).optional(), // Optional array of follower IDs
  following: z.array(z.string()).optional(), // Optional array of following IDs
})

export { createTravelerZodSchema }
