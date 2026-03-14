import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { ServiceRepository } from "@data/repositories/impl/service.repository";
import { ServiceMapper } from "@presentation/mappers/mapper";
import { ServicesGuideDocument, ServiceForPdf } from "@lib/pdf/ServicesGuideDocument";

const serviceRepository = new ServiceRepository();
const serviceMapper = new ServiceMapper();

const FILENAME = "CUMI-Services-Guide.pdf";

export async function GET() {
  try {
    const services = await serviceRepository.getAll();
    const dtos = serviceMapper.toDTOs(services);
    const forPdf: ServiceForPdf[] = dtos.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description || undefined,
      items: Array.isArray(s.items) ? s.items : [],
    }));

    const generatedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const pdf = await renderToBuffer(
      React.createElement(ServicesGuideDocument, {
        services: forPdf,
        generatedDate,
      })
    );

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${FILENAME}"`,
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (error: unknown) {
    console.error("Services guide PDF error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to generate PDF",
      },
      { status: 500 }
    );
  }
}
