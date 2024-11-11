
import Survey from '../models/Survey.js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl ='https://yjlfoubdrbcjflpbhmqx.supabase.co'
const supabaseKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqbGZvdWJkcmJjamZscGJobXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMzY4MTQsImV4cCI6MjA0NjYxMjgxNH0.8f-coNXMfPCmV-LSKfuvRS48mjAm5T6PZluztUm7o9Q'

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Supabase Key:', process.env.SUPABASE_KEY);

export const finalizeSurvey = async (req, res) => {
    const { email, step1, step2, step3 } = req.body;
  
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    try {
      // Retrieve data from Supabase
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('email', email)
        .single();
  
      if (error || !data) {
        return res.status(404).json({ error: 'Survey data not found in Supabase' });
      }
  
      // Log Supabase data to verify structure
      console.log("Supabase Data:", data);
  
      // Map data from Supabase to MongoDB schema fields
      const first_question = step2?.choice || 'No choice selected';
      const second_question = step3 || { comfort: 'No rating', looks: 'No rating', price: 'No rating' };
  
      // Log to confirm mapped values
      console.log("Mapped first_question:", first_question);
      console.log("Mapped second_question:", second_question);
  
      // Check if a document with the same email already exists
      const existingSurvey = await Survey.findOne({ email: data.email });
  
      if (existingSurvey) {
        // If survey already exists, update it
        existingSurvey.first_question = first_question;
        existingSurvey.second_question = second_question;
        existingSurvey.status = data.status;
  
        // Save the updated survey to MongoDB
        const updatedSurvey = await existingSurvey.save();
        console.log("Survey updated in MongoDB:", updatedSurvey);
  
        // Delete the data from Supabase
        const { error: deleteError } = await supabase
          .from('questions')
          .delete()
          .eq('email', email);
  
        if (deleteError) {
          console.error('Error deleting from Supabase:', deleteError);
        }
  
        res.status(200).json({ message: 'Survey updated and finalized successfully', survey: updatedSurvey });
      } else {
        // If survey doesn't exist, create a new one
        const newSurvey = await Survey.create({
          email: data.email,
          first_question,
          second_question,
          status: data.status,
        });
  
        console.log("Survey saved to MongoDB:", newSurvey);
  
        // Delete the data from Supabase
        const { error: deleteError } = await supabase
          .from('questions')
          .delete()
          .eq('email', email);
  
        if (deleteError) {
          console.error('Error deleting from Supabase:', deleteError);
        }
  
        res.status(200).json({ message: 'Survey finalized and stored successfully', survey: newSurvey });
      }
    } catch (err) {
      console.error('Finalization Error:', err);
      res.status(500).json({ error: 'Failed to finalize survey' });
    }
  };
  




export const getSurvey = async (req, res) => {
    const { email } = req.query;
    console.log("Request to get survey progress with email:", email);
  
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
  
    try {
      
      const { data, error } = await supabase
        .from('questions') 
        .select('*')
        .eq('email', email)
        .limit(1); 
  
      console.log("Supabase data:", data, "Supabase error:", error);
  
      if (data) {
       
        console.log("Survey progress found in Supabase:", data);
        return res.json(data);
      }
  
      const survey = await Survey.findOne({ email });
      console.log("MongoDB survey result:", survey);
  
      if (!survey) {
        console.log("Survey progress not found for email:", email);
        return res.status(404).json({ message: "Survey progress not found" });
      }
  
      res.json(survey);
    } catch (err) {
      console.error("Error retrieving survey:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  
export const createOrUpdateSurvey = async (req, res) => {
    const { email, step, responses } = req.body;

    if (!email || !step || !responses) {
      return res.status(400).json({ error: 'Email, step, and responses are required' });
    }

    try {
      
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('email', email)
        .limit(1); 

      if (error) {
        console.error("Error fetching survey from Supabase:", error);
        return res.status(500).json({ error: 'Failed to fetch survey data from Supabase' });
      }

      if (data.length > 0) {
        
        console.log("Survey found in Supabase. Updating responses...");

        const updatedData = { ...data[0].data, [step]: responses };

 
        const { data: updatedSurvey, error: updateError } = await supabase
          .from('questions')
          .update({
            step,              
            data: updatedData  
          })
          .eq('email', email); 

        if (updateError) {
          console.error("Error updating survey in Supabase:", updateError);
          return res.status(500).json({ error: 'Failed to update survey in Supabase' });
        }

        console.log("Survey successfully updated in Supabase:", updatedSurvey);
        return res.status(200).json(updatedSurvey[0]);
      } else {
     
        console.log("Survey not found in Supabase. Creating new survey...");

        const { data: createdSurvey, error: createError } = await supabase
          .from('questions')
          .insert([
            {
              email,
              step,               
              data: { [step]: responses }, 
              status: 'in-progress' 
            }
          ]);

        if (createError) {
          console.error("Error creating survey in Supabase:", createError);
          return res.status(500).json({ error: 'Failed to create survey in Supabase' });
        }

        console.log("Survey successfully created in Supabase:", createdSurvey);
        return res.status(200).json(createdSurvey[0]);
      }
    } catch (error) {
      console.error("Error in createOrUpdateSurvey:", error);
      return res.status(500).json({ error: 'Failed to create or update survey' });
    }
  };
