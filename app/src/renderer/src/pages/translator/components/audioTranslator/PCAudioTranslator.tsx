import {
  ApiResponse,
  AvailableModelsType,
  StartStreamingType
} from '../../../../globalTypes/globalApi'
import { useEffect, useState } from 'react'
import TranslatorTextarea from './assets/TranslatorTextarea'
import WhisperModels from './assets/WhisperModels'
import { toast } from 'react-toastify'
import TranslatorSettings from '../translatorSettings/TranslatorSettings'

const PCAudioTranslator: React.FC = () => {
  const [transcriptionSentence, setTranscriptionSentence] = useState<string>('')
  const [translationSentence, setTranslationSentence] = useState<string>('')
  const [translationError, setTranslationError] = useState<string | null>(null)
  const [isCapturingAudio, setIsCapturingAudio] = useState<boolean>(false)
  const [selectedModel, setSelectedModel] = useState<AvailableModelsType | null>(null)
  useEffect(() => {
    const handleStreamingData = (_event: any, data: ApiResponse<StartStreamingType>): void => {
      if (data.success) {
        if (data.data.status !== undefined && data.data.status === 0) {
          setTranscriptionSentence((prev) => {
            return prev + data.data.transcription
          })
        }
      } else {
        toast.error(`handleStreamingData ${data.error}`, {
          isLoading: false,
          autoClose: 5000
        })
      }
    }

    const handleStreamingError = (_event: any, data: any): void => {
      toast.error(`handleStreamingError ${data.error}`, {
        isLoading: false,
        autoClose: 5000
      })
    }

    window.api.on('streaming-data', handleStreamingData)
    window.api.on('streaming-error', handleStreamingError)

    return (): void => {
      window.api.removeListener('streaming-data', handleStreamingData)
      window.api.removeListener('streaming-error', handleStreamingError)
    }
  }, [])

  useEffect(() => {
    const handleTranslationData = (_event: any, data: string): void => {
      setTranslationSentence((prev) => {
        return prev + data
      })
    }

    const handleTranslationError = (_event: any, data: string): void => {
      setTranslationError(data)
    }

    window.api.on('translation-data', handleTranslationData)
    window.api.on('translation-error-data', handleTranslationError)

    return (): void => {
      window.api.removeListener('translation-data', handleTranslationData)
      window.api.removeListener('translation-error-data', handleTranslationError)
      setTranslationError(null)
    }
  }, [])

  return (
    <article className=" flex flex-col text-start items-start justify-start w-full h-full gap-4">
      <WhisperModels selectedModel={selectedModel} setSelectedModel={setSelectedModel} />

      <div className="flex flex-col w-full h-full text-start items-center justify-start px-4 md:px-8 gap-4 py-6">
        <TranslatorTextarea
          transcriptionContent={transcriptionSentence}
          translationContent={translationSentence}
          translationError={translationError}
          selectedModel={selectedModel}
          isCapturingAudio={isCapturingAudio}
          setIsCapturingAudio={setIsCapturingAudio}
          setTranscriptionSentence={setTranscriptionSentence}
          setTranslationSentence={setTranslationSentence}
          setTranslationError={setTranslationError}
        />
      </div>

      <div className="flex flex-col w-full h-full text-start items-start justify-start ">
        <TranslatorSettings />
      </div>
    </article>
  )
}

export default PCAudioTranslator
