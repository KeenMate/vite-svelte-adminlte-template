<script lang="ts">
	import {run} from "svelte/legacy"

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

	type Props = {
		maxFileSize?: string; // 1GB
		allowedFileTypes?: string[] | null;
		maxNumberOfFiles?: number | null;
		simultaneousUploads?: number;
		fieldName?: string;
		endpoint: string;
		uploadData?: any;
		uppyOptions?: any;
		xhrOptions?: any;
	}

	let {
		    maxFileSize         = "1000000000",
		    allowedFileTypes    = undefined,
		    maxNumberOfFiles    = undefined,
		    simultaneousUploads = 2,
		    fieldName           = "file",
		    endpoint,
		    uploadData          = {},
		    uppyOptions         = undefined,
		    xhrOptions          = null
	    }: Props = $props()

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

	let open = $state(false)

	$effect(() => {
		uppy.setMeta(uploadData)
	})
	$effect(() => {
		uppy.setOptions({
			restrictions: {
				maxNumberOfFiles,
				maxFileSize,
				allowedFileTypes
			},
			...(uppyOptions || {})
		})
	})
	$effect(() => {
		uppy.getPlugin("XHRUpload").setOptions({
			endpoint,
			fieldName,
			limit: simultaneousUploads,
			...(xhrOptions || {})
		})
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
