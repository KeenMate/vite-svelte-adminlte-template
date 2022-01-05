<script>
  import {userInfo} from "../stores/authentication"
  import {LteButton, Card, PageHeader, FlexContainer} from "svelte-adminlte"
  import {getConfig, setConfig} from "svelte-adminlte"
  import {_} from "svelte-i18n"
  import notification from "../providers/notification-provider"

</script>

<PageHeader>
	{$_("page1.title")}
</PageHeader>

<p>
	Page1 content
</p>
