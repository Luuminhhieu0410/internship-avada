import {
  Layout,
  LegacyCard,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  SkeletonTabs
} from '@shopify/polaris';

import useScreenType from '@assets/hooks/utils/useScreenType';

export default function NotificationSettingsSkeleton() {
  const screenType = useScreenType();
  return (
    <SkeletonPage title="Settings" fullWidth={true}>
      <Layout>
        {screenType.isDesktop ||
          (screenType.isLargeDesktop && (
            <Layout.Section variant="oneThird">
              <LegacyCard title="Preview" subdued>
                <div style={{padding: '40px'}}>
                  <SkeletonDisplayText size="small" />
                  <br />
                  <SkeletonBodyText lines={4} />
                </div>
              </LegacyCard>
            </Layout.Section>
          ))}

        <Layout.Section>
          <LegacyCard sectioned>
            <SkeletonTabs count={2} />
            <br />
            <br />
            <SkeletonDisplayText size="small" />
            <br />
            <SkeletonBodyText lines={1} />
            <br />
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8}}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{height: 60, borderRadius: 8}} />
              ))}
            </div>
            <br />
            <SkeletonBodyText lines={4} />
            <br />
            <br />
            <SkeletonDisplayText size="small" /> {/* TIMING */}
            <br />
            <SkeletonBodyText lines={8} />
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
}
