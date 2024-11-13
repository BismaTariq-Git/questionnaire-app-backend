import Survey from "../models/Survey.js";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yjlfoubdrbcjflpbhmqx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqbGZvdWJkcmJjamZscGJobXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMzY4MTQsImV4cCI6MjA0NjYxMjgxNH0.8f-coNXMfPCmV-LSKfuvRS48mjAm5T6PZluztUm7o9Q";

const supabase = createClient(supabaseUrl, supabaseKey);

export const finalizeSurvey = async (req, res) => {
  const { email, step1, step2, step3 } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res
        .status(404)
        .json({ error: "Survey data not found in Supabase" });
    }

    const first_question = step2?.choice || "No choice selected";
    const second_question = {
      looks: data.data.step3?.looks ?? "No rating",
      price: data.data.step3?.price ?? "No rating",
      comfort: data.data.step3?.comfort ?? "No rating",
    };

    const existingSurvey = await Survey.findOne({ email: data.email });

    if (existingSurvey) {
      existingSurvey.first_question = first_question;
      existingSurvey.second_question = second_question;
      existingSurvey.status = data.status;

      const updatedSurvey = await existingSurvey.save();
      res.status(200).json({
        message: "Survey updated and finalized successfully",
        survey: updatedSurvey,
      });
    } else {
      const newSurvey = await Survey.create({
        email: data.email,
        first_question,
        second_question,
        status: data.status,
      });
      res.status(200).json({
        message: "Survey finalized and stored successfully",
        survey: newSurvey,
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to finalize survey" });
  }
};

export const getSurvey = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (data) {
      return res.json(data);
    }

    const survey = await Survey.findOne({ email });

    if (!survey) {
      return res.status(404).json({ message: "Survey progress not found" });
    }

    res.json(survey);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createOrUpdateSurvey = async (req, res) => {
  const { email, step, responses } = req.body;

  if (!email || !step || !responses) {
    return res
      .status(400)
      .json({ error: "Email, step, and responses are required" });
  }

  try {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (error) {
      return res
        .status(500)
        .json({ error: "Failed to fetch survey data from Supabase" });
    }

    if (data.length > 0) {
      const updatedData = { ...data[0].data, [step]: responses };

      const { data: updatedSurvey, error: updateError } = await supabase
        .from("questions")
        .update({
          step,
          data: updatedData,
        })
        .eq("email", email);

      if (updateError) {
        return res
          .status(500)
          .json({ error: "Failed to update survey in Supabase" });
      }

      return res.status(200).json(updatedSurvey[0]);
    } else {
      const { data: createdSurvey, error: createError } = await supabase
        .from("questions")
        .insert([
          {
            email,
            step,
            data: { [step]: responses },
            status: "in-progress",
          },
        ]);

      if (createError) {
        return res
          .status(500)
          .json({ error: "Failed to create survey in Supabase" });
      }

      return res.status(200).json(createdSurvey[0]);
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to create or update survey" });
  }
};
