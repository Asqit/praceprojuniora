import { CvDetails } from "../../types"

export interface FormProps<K extends keyof CvDetails> {
  submit(data: CvDetails[K]): void
}
