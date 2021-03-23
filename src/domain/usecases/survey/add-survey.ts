export interface AddSurvey {
  add: (data: AddSurvey.Params) => Promise<void>
}

export namespace AddSurvey {
  export type Params = {
    question: string
    answers: SurveyAnswer[]
    date: Date
  }

  type SurveyAnswer = {
    image?: string
    answer: string
  }
}
