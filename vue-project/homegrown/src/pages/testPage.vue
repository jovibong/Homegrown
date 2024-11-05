<template>
  <div class="bg-primary">
    <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel" data-bs-interval="300000">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="loretta.png" class="d-block" alt="loretta.png" height="20px">
      hi
    </div>
    <div class="carousel-item">
      <img src="loretta.png" class="d-block" alt="loretta.png" height="20px">
    </div>
    <div class="carousel-item">
      <img src="loretta.png" class="d-block" alt="loretta.png" height="20px">
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
  </div>
</template>

<script>
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "../firebase/initialize";

// Function to generate a random integer between min and max
function getRandomRating(min = 60, max = 90) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
  methods: {
    async populateLessons() {
      try {
        const courseId = "course_00101";
        const lessonsData = [
          {
            lessonId: "lesson_009",
            title: "Functions",
            items: [
              {
                typeof: "video",
                name: "Lesson 9: Video",
                description: "<p>This video introduces functions in Python.</p>",
                link: "https://www.youtube.com/watch?v=9Os0o3wzS_I&list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU&index=8",
                rating: getRandomRating(),
                id: "lesson_item_001",
              },
              {
                typeof: "quiz",
                name: "Lesson 9: Quiz",
                description: "Feel free to go back to the lesson if you are unable to answer the questions",
                rating: getRandomRating(),
                id: "lesson_item_002",
                questions: [
                  { question: "How do you define a function in Python?", correct_answer: "A", options: { A: "def func_name():", B: "function func_name()", C: "func func_name()", D: "create func_name()" }, question_number: 1, type: "multiple_choice" },
                  { question: "What keyword is used to return a value?", correct_answer: "C", options: { A: "output", B: "print", C: "return", D: "yield" }, question_number: 2, type: "multiple_choice" },
                  { question: "Can a function return multiple values?", correct_answer: "A", options: { A: "Yes, using tuples", B: "No, only one value", C: "Yes, using lists", D: "No, only integers" }, question_number: 3, type: "multiple_choice" },
                  { question: "What is the default return value of a function?", correct_answer: "D", options: { A: "0", B: "1", C: "Empty string", D: "None" }, question_number: 4, type: "multiple_choice" },
                  { question: "How do you call a function in Python?", correct_answer: "B", options: { A: "call func_name", B: "func_name()", C: "invoke func_name()", D: "execute func_name" }, question_number: 5, type: "multiple_choice" },
                  { question: "What is a lambda function?", correct_answer: "C", options: { A: "A function with no arguments", B: "A function with no return value", C: "An anonymous function", D: "A function with multiple parameters" }, question_number: 6, type: "multiple_choice" },
                ],
              },
            ],
          },
        ];

        for (const lesson of lessonsData) {
          const lessonRef = doc(db, `courses/${courseId}/lessons`, lesson.lessonId);
          await setDoc(lessonRef, { title: lesson.title });

          for (const item of lesson.items) {
            const itemRef = doc(lessonRef, "lesson_items", item.id);
            await setDoc(itemRef, {
              typeof: item.typeof,
              name: item.name,
              description: item.description,
              link: item.typeof === "video" ? item.link : null,
              rating: item.rating,
            });

            if (item.typeof === "quiz" && item.questions) {
              const questionsRef = collection(itemRef, "questions");

              for (const [index, question] of item.questions.entries()) {
                await setDoc(doc(questionsRef, `question_${index + 1}`), {
                  question: question.question,
                  correct_answer: question.correct_answer,
                  options: question.options,
                  question_number: question.question_number,
                  type: question.type,
                });
              }
            }
          }
        }

        console.log("Lessons populated successfully!");
      } catch (error) {
        console.error("Error populating lessons:", error);
      }
    },
  },
};
</script>
