import mongoose, { Schema } from 'mongoose';

const FeedbackSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            default: 'other'
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    },
    {
        timestamps: true
    }
);

// Détection simple du genre
FeedbackSchema.pre('save', function(next) {
    const doc = this as any;
    if (doc.isModified('name')) {
        const maleNames = ['jean', 'paul', 'pierre', 'jacques', 'robert', 'michel'];
        const femaleNames = ['marie', 'jeanne', 'anne', 'sophie', 'catherine', 'isabelle'];
        
        const firstName = doc.name.toLowerCase().split(' ')[0];
        
        if (maleNames.includes(firstName)) {
            doc.gender = 'male';
        } else if (femaleNames.includes(firstName)) {
            doc.gender = 'female';
        } else {
            doc.gender = 'other';
        }
    }
    next();
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);
export default Feedback;