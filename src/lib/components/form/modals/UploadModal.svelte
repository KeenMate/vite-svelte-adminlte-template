<script lang="ts">
	import {createEventDispatcher, onMount} from "svelte"
	// @ts-ignore
	import {DashboardModal} from "@uppy/svelte"
	// @ts-ignore
	import Uppy from "@uppy/core"
	// @ts-ignore
	import XHRUpload from "@uppy/xhr-upload"
	import "@uppy/core/dist/style.css"
	import "@uppy/dashboard/dist/style.css"

	const dispatch = createEventDispatcher()

	export let maxFileSize = "1000000000" // 1GB
	export let allowedFileTypes: string[] | null = null
	export let maxNumberOfFiles: number | null = null
	export let simultaneousUploads = 2
	export let fieldName = "file"
	export let endpoint: string
	export let uploadData: any = {}
	export let uppyOptions: any = null
	export let xhrOptions: any = null

	export const uppy = new Uppy({
		restrictions: {
			maxFileSize,
			allowedFileTypes
		}
	})
		// .use(Dashboard)
		.use(XHRUpload, {
			endpoint,
			fieldName,
			limit: simultaneousUploads,
			getResponseData(responseText) {
				return responseText
					? JSON.parse(responseText)
					: {}
			}
		})

	export function openModal() {
		open = true
	}

	export function closeModal() {
		open = false
	}

	let open = false

	$: uppy.setMeta(uploadData)
	$: uppy.setOptions({
		restrictions: {
			maxNumberOfFiles,
			maxFileSize,
			allowedFileTypes
		},
		...(uppyOptions || {})
	})
	$: uppy.getPlugin("XHRUpload").setOptions({
		endpoint,
		fieldName,
		limit: simultaneousUploads,
		...(xhrOptions || {})
	})

	onMount(() => {
		initUppy()
	})

	function initUppy() {
		uppy.on("complete", (result: any) => {
			dispatch("uploadCompleted", result)
		})

		uppy.on("upload-success", (file: any, response: any) => {
			dispatch("uploadSuccessful", {file, response})
			// do something with file and response
		})
		uppy.on("upload-error", (file: any, error: any, response: any) => {
			dispatch("uploadError", {file, error, response})
		})
		uppy.on("dashboard:modal-closed", () => {
			open = false
			dispatch("modalClosed")
		})
	}
</script>

<DashboardModal {uppy} {open} props={{closeModalOnClickOutside: true}} />
