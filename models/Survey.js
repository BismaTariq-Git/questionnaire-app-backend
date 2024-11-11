import mongoose from 'mongoose';


const surveySchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    first_question: { type: String, required: true },
    second_question: { type: Object, required: true },
    step3: {
      comfort: { type: Number, required: false },
      looks: { type: Number, required: false },
      price: { type: Number, required: false },
    },
    status: { type: String, default: 'completed' },
  }, { timestamps: true });

const Survey = mongoose.models.Survey|| mongoose.model('Survey', surveySchema);

export default Survey;
