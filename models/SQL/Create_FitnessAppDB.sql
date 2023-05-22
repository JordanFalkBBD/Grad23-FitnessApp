USE master;
GO

CREATE DATABASE FitnesAppDB;
GO

-- Create User table
USE FitnesAppDB;
CREATE TABLE [dbo].[Users](
    [UserID] [int] IDENTITY(1,1) NOT NULL,
    [Email] [varchar](100) UNIQUE NOT NULL,
	[Metric] [bit] NOT NULL
);
GO

--Primary key constraint
USE FitnesAppDB;
ALTER TABLE Users
ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([UserID] ASC);
GO

-- Create Workout table
USE FitnesAppDB;
CREATE TABLE [dbo].[Workout](
    [WorkoutID] [int] IDENTITY(1,1) NOT NULL,
    [Name] [varchar](100) UNIQUE NOT NULL,
	[UserID] [int] NOT NULL,
	[Date] [Date] NULL
);
GO

--Primary key constraint
USE FitnesAppDB;
ALTER TABLE Workout
ADD CONSTRAINT [PK_Workout] PRIMARY KEY CLUSTERED ([WorkoutID] ASC);
GO

--Forign Key constraint
USE FitnesAppDB;
ALTER TABLE Workout
ADD CONSTRAINT [FK_Workout_User]
FOREIGN KEY (UserID) REFERENCES Users(UserID);
Go

-- Create Excersises table
USE FitnesAppDB;
CREATE TABLE [dbo].[Excersises](
    [ExcersiseID] [int] IDENTITY(1,1) NOT NULL,
    [Name] [varchar](100) NOT NULL,
	[Weight] [int] NULL,
	[Sets] [int] NULL,
	[Reps] [int] NULL,
	[WorkoutID] [int] NULL,
	[Date] [Date] NULL
);
GO

--Primary key constraint
USE FitnesAppDB;
ALTER TABLE Excersises
ADD CONSTRAINT [PK_Excersise] PRIMARY KEY CLUSTERED ([ExcersiseID] ASC);
GO

--Forign Key constraint
USE FitnesAppDB;
ALTER TABLE Excersises
ADD CONSTRAINT [FK_Excersises_Workout]
FOREIGN KEY (WorkoutID) REFERENCES Workout(WorkoutID);
Go

-- Create Cardio table
USE FitnesAppDB;
CREATE TABLE [dbo].[Cardio](
    [CardioID] [int] IDENTITY(1,1) NOT NULL,
    [Name] [varchar](100) NOT NULL,
	[Distance] [int] NULL,
	[WorkoutID] [int] NULL,
	[Date] [Date] NULL
);
GO

--Primary key constraint
USE FitnesAppDB;
ALTER TABLE Cardio
ADD CONSTRAINT [PK_Cardio] PRIMARY KEY CLUSTERED ([CardioID] ASC);
GO

--Forign Key constraint
USE FitnesAppDB;
ALTER TABLE Cardio
ADD CONSTRAINT [FK_Cardio_Workout]
FOREIGN KEY (WorkoutID) REFERENCES Workout(WorkoutID);
Go