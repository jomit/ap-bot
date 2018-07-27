USE [ContosoAPBotAnalytics]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TraceLogs](
	[TicketNumber] [nvarchar](50) NULL,
	[UserId] [nvarchar](50) NOT NULL,
	[Category] [nvarchar](50) NOT NULL,
	[Channel] [nvarchar](50) NOT NULL,
	[Status] [nvarchar](50) NOT NULL,
	[RequestStartTime] [datetime] NOT NULL,
	[RequestEndTime] [datetime] NOT NULL
) ON [PRIMARY]
GO
USE [master]
GO
ALTER DATABASE [ContosoAPBotAnalytics] SET  READ_WRITE 
GO