<script>
	import {userInfo} from "../stores/authentication"
	import {LteButton, Card, PageHeader, FlexContainer} from "@keenmate/svelte-adminlte"
	import {getConfig, setConfig} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"
	import notification from "../providers/notification-provider"
	import {onDestroy, onMount} from "svelte"
	import {customPageTitleUsed, setCustomPageTitle} from "../stores/page-title"

	onMount(() => {
		customPageTitleUsed.set(true)
		setTimeout(() => {
			setCustomPageTitle("Custom home")
		}, 1000)
	})

	onDestroy(() => {
		customPageTitleUsed.set(false)
	})
</script>

<PageHeader>
	{$_("home.title")}
</PageHeader>

<div class="row">
	<div class="col-3">
		<Card outline color="danger">
			<svelte:fragment slot="header">Actions</svelte:fragment>
			<div class="row">
				<div class="col-lg-12 m-1">
					<LteButton on:click={() => setConfig({ Foo: "Henlo" })}>
						Set config
					</LteButton>
				</div>
				<div class="col-lg-12 m-1">
					<LteButton on:click={() => null.qwe}>
						Throw
					</LteButton>
				</div>
				<div class="col-lg-12 m-1">
					<LteButton
						on:click={() =>
							notification.success(
								"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sit amet maximus ex, et lacinia est. Nullam sed orci lectus. Vivamus id arcu mauris. Ut posuere aliquam ex vel elementum. Nam aliquet non nisi sed consectetur. Quisque varius ut magna nec iaculis. Cras volutpat augue pharetra ultricies hendrerit. Ut laoreet convallis dui. Proin dapibus iaculis turpis, in posuere nulla pulvinar id. ",
								"Notification title"
							)}
					>
						Notify me
					</LteButton>
				</div>
			</div>
		</Card>
	</div>
	<div class="col-9">
		<Card outline color="danger">
			<svelte:fragment slot="header">User Info</svelte:fragment>
			{#if $userInfo}
				<pre> {JSON.stringify($userInfo, null, 2)}</pre>
			{:else}
				<b>You have to be logged in to see user info</b>
			{/if}
		</Card>
	</div>
</div>
