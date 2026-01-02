from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent
from dotenv import load_dotenv
import os
import base64
import logging

load_dotenv()

logger = logging.getLogger(__name__)

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

async def get_ai_workout_recommendations(user_data: dict, progress_data: list) -> dict:
    """
    Generate AI-powered workout recommendations based on user data and progress
    """
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"workout_rec_{user_data.get('id', 'default')}",
            system_message="You are an expert fitness coach providing personalized workout recommendations."
        ).with_model("openai", "gpt-5.2")
        
        # Prepare context from user data
        context = f"""
        User Profile:
        - Fitness Goal: {user_data.get('fitnessGoal', 'general fitness')}
        - Fitness Level: {user_data.get('fitnessLevel', 'beginner')}
        - Current Streak: {user_data.get('currentStreak', 0)} days
        - Total Workouts: {user_data.get('totalWorkouts', 0)}
        
        Recent Progress:
        - Workouts completed: {len(progress_data)}
        - Average consistency: {'High' if len(progress_data) > 5 else 'Moderate' if len(progress_data) > 2 else 'Low'}
        
        Based on this information, provide 3 personalized workout recommendations for the next week.
        For each workout, include:
        1. Workout name
        2. Duration (in minutes)
        3. Difficulty level
        4. 5 specific exercises with sets and reps
        5. Brief rationale for why this workout is recommended
        
        Format your response as JSON with this structure:
        {{
          "recommendations": [
            {{
              "name": "workout name",
              "duration": "45 min",
              "difficulty": "Intermediate",
              "exercises": [
                {{"name": "exercise", "sets": 3, "reps": "12"}},
                ...
              ],
              "rationale": "explanation"
            }},
            ...
          ]
        }}
        """
        
        user_message = UserMessage(text=context)
        response = await chat.send_message(user_message)
        
        # Parse response
        import json
        try:
            # Try to extract JSON from response
            response_text = response.strip()
            if '```json' in response_text:
                response_text = response_text.split('```json')[1].split('```')[0].strip()
            elif '```' in response_text:
                response_text = response_text.split('```')[1].split('```')[0].strip()
            
            result = json.loads(response_text)
            return result
        except:
            # Fallback if parsing fails
            return {
                "recommendations": [],
                "error": "Failed to parse AI response",
                "raw_response": response
            }
            
    except Exception as e:
        logger.error(f"Error generating AI recommendations: {str(e)}")
        return {
            "error": str(e),
            "recommendations": []
        }


async def analyze_exercise_form(image_base64: str, exercise_name: str) -> dict:
    """
    Analyze exercise form from uploaded image using AI vision
    """
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id="form_check",
            system_message="You are an expert fitness trainer analyzing exercise form from images."
        ).with_model("openai", "gpt-5.2")
        
        # Create image content
        image_content = ImageContent(image_base64=image_base64)
        
        prompt = f"""
        Analyze the exercise form in this image for: {exercise_name}
        
        Provide feedback on:
        1. Overall form quality (score 1-10)
        2. What's being done correctly
        3. What needs improvement
        4. Safety concerns (if any)
        5. Specific tips for better form
        
        Format your response as JSON:
        {{
          "score": 8,
          "strengths": ["point 1", "point 2"],
          "improvements": ["point 1", "point 2"],
          "safety_concerns": ["concern 1"] or [],
          "tips": ["tip 1", "tip 2"]
        }}
        """
        
        user_message = UserMessage(
            text=prompt,
            file_contents=[image_content]
        )
        
        response = await chat.send_message(user_message)
        
        # Parse response
        import json
        try:
            response_text = response.strip()
            if '```json' in response_text:
                response_text = response_text.split('```json')[1].split('```')[0].strip()
            elif '```' in response_text:
                response_text = response_text.split('```')[1].split('```')[0].strip()
            
            result = json.loads(response_text)
            return result
        except:
            return {
                "score": 0,
                "error": "Failed to parse AI response",
                "raw_response": response
            }
            
    except Exception as e:
        logger.error(f"Error analyzing form: {str(e)}")
        return {
            "error": str(e),
            "score": 0
        }


async def get_rest_day_suggestion(user_data: dict, recent_workouts: list) -> dict:
    """
    Smart rest day suggestions based on workout history and recovery
    """
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"rest_day_{user_data.get('id', 'default')}",
            system_message="You are an expert fitness recovery specialist."
        ).with_model("openai", "gpt-5.2")
        
        context = f"""
        User Profile:
        - Current Streak: {user_data.get('currentStreak', 0)} days
        - Total Workouts: {user_data.get('totalWorkouts', 0)}
        - Fitness Level: {user_data.get('fitnessLevel', 'beginner')}
        
        Recent Workout History:
        - Workouts in past week: {len(recent_workouts)}
        - Last workout: {recent_workouts[0] if recent_workouts else 'None'}
        
        Should this user take a rest day? Provide:
        1. Recommendation (yes/no)
        2. Reasoning
        3. Recovery tips if rest is recommended
        4. Light activities they can do on rest day
        
        Format as JSON:
        {{
          "should_rest": true/false,
          "reasoning": "explanation",
          "recovery_tips": ["tip1", "tip2"],
          "light_activities": ["activity1", "activity2"]
        }}
        """
        
        user_message = UserMessage(text=context)
        response = await chat.send_message(user_message)
        
        # Parse response
        import json
        try:
            response_text = response.strip()
            if '```json' in response_text:
                response_text = response_text.split('```json')[1].split('```')[0].strip()
            elif '```' in response_text:
                response_text = response_text.split('```')[1].split('```')[0].strip()
            
            result = json.loads(response_text)
            return result
        except:
            return {
                "should_rest": False,
                "error": "Failed to parse AI response",
                "raw_response": response
            }
            
    except Exception as e:
        logger.error(f"Error getting rest day suggestion: {str(e)}")
        return {
            "error": str(e),
            "should_rest": False
        }
