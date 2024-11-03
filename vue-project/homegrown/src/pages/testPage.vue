<template>
  <div>
    <button @click="addLessonWithItems">
      Add Lesson with Items to Firebase
    </button>

    <div>
      <b-button v-b-toggle.collapse-1 variant="primary"
        >Toggle Collapse</b-button
      >
      <b-collapse id="collapse-1" class="mt-2">
        <b-card>
          <p class="card-text">Collapse contents Here</p>
          <b-button v-b-toggle.collapse-1-inner size="sm"
            >Toggle Inner Collapse</b-button
          >
          <b-collapse id="collapse-1-inner" class="mt-2">
            <b-card>Hello!</b-card>
          </b-collapse>
        </b-card>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/initialize";

export default {
  name: "TestPage",
  methods: {
    async addLessonWithItems() {
      try {
        const courseId = "course_00101";
        const lessonId = "lesson_002";

        // Reference to the lesson document
        const lessonRef = doc(
          collection(db, `courses/${courseId}/lessons`),
          lessonId
        );

        // Set the lesson document
        await setDoc(lessonRef, {
          title: "Variables",
          next_name: "Lesson 2: Quiz",
        });

        // Reference to the lesson_items collection
        const lessonItemsRef = collection(
          db,
          `courses/${courseId}/lessons/${lessonId}/lesson_items`
        );

        // Add lesson_item_001 (Video)
        await setDoc(doc(lessonItemsRef, "lesson_item_001"), {
          description:
            "In this lesson, you will dive into the fundamental concept of variables in Python...",
          link: "https://www.youtube.com/watch?v=k9TUPpGqYTo&list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU&index=2",
          name: "Lesson 2: Video",
          next_name: "Lesson 2: Quiz",
          rating: 78,
          title: "Understanding Variables in Python",
          typeof: "video",
        });

        // Add lesson_item_002 (Quiz)
        const quizRef = doc(lessonItemsRef, "lesson_item_002");
        await setDoc(quizRef, {
          description:
            "Feel free to go back to the lesson if you are unable to answer the questions.",
          name: "Lesson 2: Quiz",
          rating: 84,
          title: "Test Your Knowledge on Variables",
          typeof: "quiz",
        });

        // Reference to the questions collection under lesson_item_002
        const questionsRef = collection(quizRef, "questions");

        const questions = [
          {
            question_number: 1,
            type: "multiple_choice",
            question:
              "Which of the following is a valid variable name in Python?",
            options: {
              A: "1_variable",
              B: "variable_1",
              C: "variable-name",
              D: "variable name",
            },
            correct_answer: "B",
          },
          {
            question_number: 2,
            type: "multiple_choice",
            question:
              "What is the output of the following code: `x = 5; print(x)`?",
            options: { A: "5", B: "x", C: "`x = 5`", D: "None" },
            correct_answer: "A",
          },
          {
            question_number: 3,
            type: "multiple_choice",
            question:
              "Which data type is used to store whole numbers in Python?",
            options: { A: "float", B: "str", C: "int", D: "bool" },
            correct_answer: "C",
          },
          {
            question_number: 4,
            type: "multiple_choice",
            question:
              "How can you declare a variable named `num` and assign it the value 10?",
            options: {
              A: "`var num = 10`",
              B: "`num <- 10`",
              C: "`num = 10`",
              D: "`let num = 10`",
            },
            correct_answer: "C",
          },
          {
            question_number: 5,
            type: "multiple_choice",
            question:
              "What will happen if you try to use an undefined variable?",
            options: {
              A: "An error is raised",
              B: "It returns None",
              C: "The program continues",
              D: "It assigns 0 by default",
            },
            correct_answer: "A",
          },
          // Additional 5 questions
          {
            question_number: 6,
            type: "multiple_choice",
            question: "What keyword is used to define a variable in Python?",
            options: { A: "let", B: "var", C: "define", D: "None" },
            correct_answer: "D",
          },
          {
            question_number: 7,
            type: "multiple_choice",
            question: "Variables in Python are:",
            options: {
              A: "Mutable",
              B: "Immutable",
              C: "Fixed",
              D: "Constant",
            },
            correct_answer: "A",
          },
          {
            question_number: 8,
            type: "multiple_choice",
            question: "What operator is used to assign a value to a variable?",
            options: { A: "+", B: "-", C: "=", D: ":" },
            correct_answer: "C",
          },
          {
            question_number: 9,
            type: "multiple_choice",
            question: "Which of these is NOT a valid variable name in Python?",
            options: {
              A: "variable1",
              B: "_variable",
              C: "variable$",
              D: "variable_name",
            },
            correct_answer: "C",
          },
          {
            question_number: 10,
            type: "multiple_choice",
            question: "What function can display a variable’s value in Python?",
            options: { A: "echo()", B: "display()", C: "print()", D: "show()" },
            correct_answer: "C",
          },
        ];

        // Add each question to the questions collection
        for (let i = 0; i < questions.length; i++) {
          const questionRef = doc(questionsRef, `question_${i + 1}`);
          await setDoc(questionRef, questions[i]);
        }

        console.log("Lesson and items with questions added successfully.");
      } catch (error) {
        console.error("Error adding lesson and items:", error);
      }
    },
  },
};
</script>
