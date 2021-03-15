export type SurveyModel = {
  question: string
  answers: SurveyAnswer[]
  date: Date
}

export type SurveyAnswer = {
  image?: string
  answer: string
}
