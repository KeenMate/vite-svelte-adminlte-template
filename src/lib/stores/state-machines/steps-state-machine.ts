import {get, writable} from "svelte/store"

type StepConditionCheckRedirectResult = { code: string }
/**
 * Returning `true` value means success. `false` is failure and `{code: "..."}` is, well... redirect
 */
type StepConditionCheckResult = boolean
	| StepConditionCheckRedirectResult

type StepConditionCheckResultWrapped = Promise<StepConditionCheckResult> | StepConditionCheckResult

type Step<TStepData = any> = {
	code: string

	initialStepData?: TStepData

	/**
	 * Conditions to be satisfied before **entering** this step
	 */
	preConditions?: ((stepData: TStepData) => StepConditionCheckResultWrapped)[]

	/**
	 * Conditions to be satisfied before **leaving** this step
	 */
	postConditions?: ((stepData: TStepData) => StepConditionCheckResultWrapped)[]
}

async function resolveConditionChecksAsync(conditionResults: StepConditionCheckResultWrapped[]) {
	const conditionResultsAwaited = await Promise.all(conditionResults)

	const stepRedirection = conditionResultsAwaited.find(x => typeof x !== "boolean" && typeof x.code === "string") as StepConditionCheckRedirectResult
	if (stepRedirection?.code) {
		return stepRedirection
	}

	return conditionResultsAwaited.every(x => x)
}

export default function createStepsStateMachine(steps: Step[]) {
	const getInitialStepData = () => {
		return Object.fromEntries(
			steps.map(x => [
				x.code,
				x.initialStepData
			])
		) as { [stepCode: string]: any }
	}

	const store                    = writable({
		currentStepIndex: 0,
		steps,
		stepData:         getInitialStepData(),

		get currentStep(): Step {
			return this.steps[this.currentStepIndex]
		},
		get currentStepData(): any {
			return this.stepData[this.currentStep.code]
		}
	})
	const {subscribe, set, update} = store

	return {
		subscribe,
		set,
		nextStep(nextStepData?: any) {
			update(state => {
				state.currentStepIndex++
				// state.currentStep = state.steps[++state.currentStepIndex]
				state.stepData[state.currentStep.code] = nextStepData

				return state
			})
		},
		async tryNextStepAsync(nextStepData?: any): Promise<Step | "finished" | false> {
			const state = get(store)

			const isCurrentStepLast = state.currentStepIndex === state.steps.length - 1

			const allConditions = [
				state.steps[state.currentStepIndex].postConditions,
				!isCurrentStepLast && state.steps[state.currentStepIndex + 1].preConditions
			] as (Step["preConditions"] | Step["postConditions"] | false)[]
			for (let conditions of allConditions) {
				if (conditions === false || !conditions?.length) {
					continue
				}

				const conditionResults        = conditions.map(x => x(state.stepData[state.currentStep.code]) as StepConditionCheckResultWrapped)
				const conditionResultsAwaited = await Promise.all(conditionResults)

				const stepRedirection = conditionResultsAwaited
					.find(x => typeof x !== "boolean" && typeof x.code === "string") as StepConditionCheckRedirectResult
				if (stepRedirection?.code) {
					return this.setStep(stepRedirection?.code)
				}

				const conditionsPassed = conditionResultsAwaited.every(x => x)

				if (!conditionsPassed) {
					return false
				}
			}

			if (isCurrentStepLast) {
				return "finished"
			}

			update(state => {
				state.currentStepIndex++
				// state.currentStep = state.steps[++state.currentStepIndex]
				if (nextStepData !== undefined) {
					state.stepData[state.currentStep.code] = nextStepData
				}

				return state
			})

			// currentStepIndex incremented in update step
			return state.steps[state.currentStepIndex]
		},
		goToPreviousStep(newStepData?: any) {
			const {currentStepIndex} = get(store)
			if (!currentStepIndex) {
				return
			}

			update(state => {
				state.currentStepIndex--
				// state.currentStep = state.steps[--state.currentStepIndex]
				if (newStepData) {
					state.stepData[state.currentStep.code] = newStepData
				}

				return state
			})
		},
		setStep(stepCode: Step["code"], stepData?: any): Step | false {
			const newStepIdx = steps.findIndex(x => x.code === stepCode)
			if (newStepIdx === -1) {
				return false
			}

			update(state => {
				state.currentStepIndex = newStepIdx
				if (stepData !== undefined) {
					state.stepData[newStepIdx] = stepData
				}

				return state
			})

			return steps[newStepIdx]
		},
		async trySetStepAsync(stepCode: Step["code"], stepData?: any) {
			const currentStepIdx = get(store).currentStepIndex
			const newStepIdx     = steps.findIndex(x => x.code === stepCode)
			const newStep        = steps[newStepIdx]

			if (newStepIdx === -1 || currentStepIdx === newStepIdx) {
				// console.log("try set step: new step not found or is current")
				return false
			}
			if (newStepIdx < currentStepIdx || (await this.checkStepAsync(newStep))) {
				// console.log("try set step: (going back - always allow) or change step allowed")
				// navigating to one of previous steps
				return this.setStep(stepCode, stepData)
			}

			return false
		},
		async checkStepAsync(step: Step) {
			const {stepData}  = get(store)
			const stepIdx     = steps.indexOf(step)
			const theStepData = stepData[step.code]

			const previousStepIdx  = stepIdx - 1
			const previousStep     = steps[previousStepIdx]
			const previousStepData = previousStep && stepData[previousStep.code]

			const allConditions = [
				[previousStep?.postConditions, previousStepData],
				[step.preConditions, theStepData]
			] as [((stepData: any) => StepConditionCheckResultWrapped)[], any][]
			// console.log("check step: conditions", allConditions)

			for (const [conditions, conditionsStepData] of allConditions) {
				if (!conditions?.length) {
					continue
				}

				const conditionResults = conditions.map(x => x(conditionsStepData) as StepConditionCheckResultWrapped)
				const res              = await resolveConditionChecksAsync(conditionResults)
				// console.log("check step: resolution", res)

				if (!res) {
					return false
				}
				if (res.code) {
					return this.setStep(res.code)
				}
			}

			return true
		},
		reset() {
			update(state => {
				Object.assign(state, {
					currentStepIndex: 0,
					stepData:         getInitialStepData()
				})

				return state
			})
		}
	}
}
