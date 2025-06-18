<script lang="ts">
	import {ErrorToastrTimeout} from "$lib/constants/toastr.js"
	import {onDestroy, onMount} from "svelte"
	import {Badge, Toastr, TopNavItem, WithLazyLoader} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"
	// import {ContentFileEndpoints} from "$lib/constants/urls.js"
	import {fileSizeToString} from "$lib/helpers/file-size-helpers.js"
	import NotificationProvider from "$lib/providers/notification-provider.js"
	import {
		getNotificationFilesAsync,
		updateUserLastSeenNotificationAsync
	} from "$lib/providers/socket/notifications-channel.js"
	import {ContentFileEndpoints} from "$lib/constants/urls.js"
	import {LastSeenNotificationId} from "$lib/stores/authentication.js"
	import {reduceWhile} from "@keenmate/js-common-helpers/helpers/array.js"

	const messages = NotificationProvider.messages

	let wrapper              = $state()
	let notificationsElement = $state()

	let visible               = $state(false)
	let notificationsFilesMap = $state({})


	onMount(() => {
		document.body.addEventListener("click", onBodyClicked)
	})

	onDestroy(() => {
		document.body.removeEventListener("click", onBodyClicked)
	})

	function getUnseenNotificationsCount(msgs, notificationId) {
		if (!notificationId) {
			return 0
		}

		return reduceWhile(
			msgs, (acc, notification) =>
				notification.notificationId === notificationId
					? {state: "term", result: acc}
					: {state: "cont", result: acc + 1},
			0
		)
	}

	function toggleDropdown() {
		visible = !visible

		const latestNotification = $messages[0]
		console.log("Latest notification", latestNotification)
		if (latestNotification?.notificationId) {
			updateLastSeenNotificationAsync(latestNotification.notificationId)
		}
	}

	async function updateLastSeenNotificationAsync(notificationId) {
		await updateUserLastSeenNotificationAsync(notificationId)

		$LastSeenNotificationId = notificationId
	}

	function onBodyClicked(ev) {
		if (!visible) {
			return
		}

		const wrapperBoundary       = wrapper.getBoundingClientRect()
		const notificationsBoundary = notificationsElement.getBoundingClientRect()

		const clickedInside = [wrapperBoundary, notificationsBoundary]
			.find(x => x.x < ev.clientX && x.right > ev.clientX
				&& x.y < ev.clientY && x.bottom > ev.clientY)
		if (clickedInside) {
			return
		}

		visible = false
	}

	async function toggleNotificationDetail(id) {
		Object.keys(notificationsFilesMap)
			.map(x => {
				notificationsFilesMap[x].visible = false
			})

		if (!notificationsFilesMap[id]) {
			notificationsFilesMap[id] = {
				visible:   true,
				filesTask: loadNotificationFilesAsync(id)
			}
			notificationsFilesMap     = notificationsFilesMap
			return
		}

		notificationsFilesMap[id].visible = !notificationsFilesMap[id].visible
		notificationsFilesMap             = notificationsFilesMap
	}

	async function loadNotificationFilesAsync(id) {
		try {
			const response = await getNotificationFilesAsync(id)

			return response.data
		} catch (error) {
			console.error("Could not load notification files", error, id)
			Toastr.error($_("notifications.messages.notificationFilesNotLoaded"), null, {timeOut: ErrorToastrTimeout})
		}
	}

	let stableLastSeenNotificationId = $derived(!visible
		? $LastSeenNotificationId || -1
		: stableLastSeenNotificationId)
	let unseenNotificationsCount     = $derived(getUnseenNotificationsCount($messages, stableLastSeenNotificationId))
</script>

<div bind:this={wrapper}>
	<TopNavItem href="javascript:void(0)" on:click={toggleDropdown}>
		<i
			class="fas fa-bell fa-fw"
			class:has-text-danger={unseenNotificationsCount}
		>
		</i>
	</TopNavItem>
	<div bind:this={notificationsElement} class="notifications" class:d-flex={visible}>
		<h2>Notifications</h2>

		{#each $messages as item, i (item.notificationId)}
			<div
				class="notifications-item"
				onclick={() => toggleNotificationDetail(item.notificationId || item.notificationId)}
			>
				<div class="text">
					<h4 class:text-bold={i < unseenNotificationsCount}>
						{item.title}
					</h4>
					<p class="m-0">{item.message}</p>
				</div>

				{#if notificationsFilesMap[item.notificationId || item.notificationId]?.visible}
					<WithLazyLoader task={notificationsFilesMap[item.notificationId || item.notificationId].filesTask}>
						{#snippet children({data})}
							<div class="d-flex flex-wrap gap-1">
								{#each data || [] as file (file.fileCode)}
									<a href={ContentFileEndpoints.downloadFile(file.fileCode)} target="_blank">
										<Badge color="secondary" title="{fileSizeToString(file.size)} {file.contentType}">
											<i class="fas fa-file-alt fa-fw"></i> {file.filename}
										</Badge>
									</a>
								{/each}
							</div>
						{/snippet}
					</WithLazyLoader>
				{/if}
			</div>
		{:else}
			<div class="notifications-item">
				<div class="text">
					<h4>{$_("notifications.messages.noNewNotifications")}</h4>
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	//:global {
	//	.dropdown-menu {
	//		min-width: 20rem;
	//	}
	//}

	@import "../../../../assets/css/notifications-dropdown";
</style>
