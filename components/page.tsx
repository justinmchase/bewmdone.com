import { useRouter } from "next/router"
import { OperationalUI, useWindowSize, Sidenav, SidenavItem, DimensionIcon, SidenavHeader, Page, PageContent, PageArea, OlapIcon, HomeIcon } from "@operational/components"
import { useState } from "react"

export default function ({ title, children }) {
  const { height } = useWindowSize()
  const router = useRouter()
  const { route, asPath } = router
  if (route !== asPath) {
    // Its possible for index.html to be loaded with a url such as http://localhost/encrypt
    // In that case the router can get out of sync with the starting location
    // So we just push the route and it will get in sync
    switch (asPath) {
      case '/encrypt':
      case '/decrypt':
        router.push(asPath)
        break
      default:
        router.push('/')
        break
    }
  }

  return (
    <OperationalUI>
      <div style={{ display: "flex", height }}>
        <Sidenav compact>
          <SidenavHeader condensed label="Navigation">
            <SidenavItem
              label="Home"
              icon={HomeIcon}
              onClick={() => router.push('/')}
            />
            <SidenavItem
              label="Encrypt"
              icon={OlapIcon}
              onClick={() => router.push('/encrypt')}
            />
            <SidenavItem
              label="Decrypt"
              icon={DimensionIcon}
              onClick={() => router.push('/decrypt')}
            />
          </SidenavHeader>
        </Sidenav>
        <Page title={title}>
          <PageContent areas="main">
            <PageArea name="main">
              {children}
            </PageArea>
          </PageContent>
        </Page>
      </div>
    </OperationalUI>
  )
}
