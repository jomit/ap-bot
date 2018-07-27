USE [ContosoEdw]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AutoInvoiceHeader](
	[InvoiceNumber] [nvarchar](50) NOT NULL,
	[SupplierCode] [nvarchar](10) NOT NULL,
	[InvoiceStatus] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_AutoInvoiceHeader] PRIMARY KEY CLUSTERED 
(
	[InvoiceNumber] ASC,
	[SupplierCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PurchaseOrder](
	[SAPPONumber] [nvarchar](50) NOT NULL,
	[PurchaseOrderStatus] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_PurchaseOrder] PRIMARY KEY CLUSTERED 
(
	[SAPPONumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Supplier](
	[SupplierCode] [nvarchar](10) NOT NULL,
	[Name] [nvarchar](500) NOT NULL,
 CONSTRAINT [PK_Suppliers] PRIMARY KEY CLUSTERED 
(
	[SupplierCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

INSERT [dbo].[AutoInvoiceHeader] ([InvoiceNumber], [SupplierCode], [InvoiceStatus]) VALUES (N'11001', N'1234000', N'Processing')
GO
INSERT [dbo].[AutoInvoiceHeader] ([InvoiceNumber], [SupplierCode], [InvoiceStatus]) VALUES (N'11001', N'149033', N'InReview')
GO
INSERT [dbo].[AutoInvoiceHeader] ([InvoiceNumber], [SupplierCode], [InvoiceStatus]) VALUES (N'11002', N'149033', N'Paid')
GO
INSERT [dbo].[AutoInvoiceHeader] ([InvoiceNumber], [SupplierCode], [InvoiceStatus]) VALUES (N'11003', N'120010', N'Pending')
GO
INSERT [dbo].[PurchaseOrder] ([SAPPONumber], [PurchaseOrderStatus]) VALUES (N'11001', N'InReview')
GO
INSERT [dbo].[PurchaseOrder] ([SAPPONumber], [PurchaseOrderStatus]) VALUES (N'11002', N'Released')
GO
INSERT [dbo].[PurchaseOrder] ([SAPPONumber], [PurchaseOrderStatus]) VALUES (N'4300000009', N'Closed')
GO
INSERT [dbo].[Supplier] ([SupplierCode], [Name]) VALUES (N'120010', N'ABC Company')
GO
INSERT [dbo].[Supplier] ([SupplierCode], [Name]) VALUES (N'1233100', N'Contestant TV')
GO
INSERT [dbo].[Supplier] ([SupplierCode], [Name]) VALUES (N'1233200', N'Connection Consultants')
GO
INSERT [dbo].[Supplier] ([SupplierCode], [Name]) VALUES (N'1233300', N'Contestant House')
GO
INSERT [dbo].[Supplier] ([SupplierCode], [Name]) VALUES (N'1233400', N'Contoso XYZ')
GO
INSERT [dbo].[Supplier] ([SupplierCode], [Name]) VALUES (N'1233500', N'Contestant Funds')
GO
INSERT [dbo].[Supplier] ([SupplierCode], [Name]) VALUES (N'1234000', N'Contoso Space')
GO
INSERT [dbo].[Supplier] ([SupplierCode], [Name]) VALUES (N'1234500', N'Contestant Network')
GO
INSERT [dbo].[Supplier] ([SupplierCode], [Name]) VALUES (N'1234600', N'Contoso LLC')
GO
INSERT [dbo].[Supplier] ([SupplierCode], [Name]) VALUES (N'1234700', N'Contestant Ltd')
GO
INSERT [dbo].[Supplier] ([SupplierCode], [Name]) VALUES (N'1234800', N'Connections Inc.')
GO
INSERT [dbo].[Supplier] ([SupplierCode], [Name]) VALUES (N'1234900', N'Contestant Holdings')
GO
INSERT [dbo].[Supplier] ([SupplierCode], [Name]) VALUES (N'134510', N'XYZ Company Ltd')
GO
INSERT [dbo].[Supplier] ([SupplierCode], [Name]) VALUES (N'149033', N'Contoso Inc')
GO
