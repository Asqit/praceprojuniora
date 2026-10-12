import { CvDetails } from "../../types"

export interface FormProps<K extends keyof CvDetails> {
  initialValue: CvDetails[K]
  onChange(data: CvDetails[K]): void
}
