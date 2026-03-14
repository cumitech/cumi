import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

const BRAND_COLOR = "#166534";
const TEXT_DARK = "#1e293b";
const TEXT_MUTED = "#64748b";

const styles = StyleSheet.create({
  page: {
    padding: 28,
    paddingBottom: 36,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  coverBrand: {
    fontSize: 18,
    fontWeight: 700,
    color: BRAND_COLOR,
    letterSpacing: 0.5,
  },
  coverTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: TEXT_DARK,
    marginTop: 2,
  },
  coverMeta: {
    fontSize: 8,
    color: TEXT_MUTED,
    marginTop: 4,
  },
  coverNote: {
    fontSize: 7,
    color: TEXT_MUTED,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: TEXT_DARK,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: BRAND_COLOR,
  },
  serviceBlock: {
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: BRAND_COLOR,
    marginBottom: 2,
  },
  serviceDescription: {
    fontSize: 8,
    color: TEXT_DARK,
    lineHeight: 1.35,
    marginBottom: 4,
  },
  bulletList: {
    marginLeft: 8,
  },
  bulletItem: {
    fontSize: 8,
    color: TEXT_MUTED,
    marginBottom: 1,
    lineHeight: 1.3,
  },
  footer: {
    position: "absolute",
    bottom: 14,
    left: 28,
    right: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    fontSize: 7,
    color: TEXT_MUTED,
  },
  footerBrand: {
    fontWeight: 700,
    color: BRAND_COLOR,
  },
  contactLink: {
    color: BRAND_COLOR,
    textDecoration: "none",
  },
});

export interface ServiceForPdf {
  id: string;
  title: string;
  description?: string;
  items?: string[];
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXTAUTH_URL ||
  "https://cumi.dev";
const EMAIL = "info@cumi.dev";
const PHONE = "+237 681 289 411";
const COMPANY = "CUMI";
const TAGLINE = "Digital Agency | Software Solutions for Scaling Businesses";

export function ServicesGuideDocument({
  services,
  generatedDate,
}: {
  services: ServiceForPdf[];
  generatedDate: string;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.coverBrand}>{COMPANY}</Text>
          <Text style={styles.coverTitle}>Services Guide</Text>
          <Text style={styles.coverMeta}>{TAGLINE} · Generated {generatedDate}</Text>
          <Text style={styles.coverNote}>
            For questions or a tailored proposal: {EMAIL} · {PHONE}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Our Services</Text>
        {services.length === 0 ? (
          <Text style={styles.serviceDescription}>
            No services have been added yet. Please visit our website for the latest offerings.
          </Text>
        ) : (
          services.map((svc, idx) => (
            <View key={svc.id} style={styles.serviceBlock}>
              <Text style={styles.serviceTitle}>
                {idx + 1}. {svc.title}
              </Text>
              {svc.description ? (
                <Text style={styles.serviceDescription}>{svc.description}</Text>
              ) : null}
              {svc.items && svc.items.length > 0 ? (
                <View style={styles.bulletList}>
                  {svc.items.map((item, i) => (
                    <Text key={i} style={styles.bulletItem}>
                      • {item}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          ))
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerBrand}>{COMPANY}</Text>
          <Text>
            {EMAIL} · {PHONE}
          </Text>
          <Link src={SITE_URL} style={styles.contactLink}>
            {SITE_URL.replace(/^https?:\/\//, "")}
          </Link>
        </View>
      </Page>
    </Document>
  );
}
