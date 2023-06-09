USE master;
GO

CREATE DATABASE FitnessAppDB;
GO

-- Create User table
USE FitnessAppDB;
CREATE TABLE [dbo].[Users](
    [UserID] [int] IDENTITY(1,1) NOT NULL,
    [Email] [varchar](100) UNIQUE NOT NULL,
	[Metric] [bit] NOT NULL
);
GO

--Primary key constraint
USE FitnessAppDB;
ALTER TABLE Users
ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([UserID] ASC);
GO

-- Create Workout table
USE FitnessAppDB;
CREATE TABLE [dbo].[Workout](
    [WorkoutID] [int] IDENTITY(1,1) UNIQUE NOT NULL,
    [Name] [varchar](100) NOT NULL,
	[UserID] [int] NOT NULL,
	[Date] [Date] NULL
);
GO

--Primary key constraint
USE FitnessAppDB;
ALTER TABLE Workout
ADD CONSTRAINT [PK_Workout] PRIMARY KEY CLUSTERED ([WorkoutID] ASC);
GO

--Forign Key constraint
USE FitnessAppDB;
ALTER TABLE Workout
ADD CONSTRAINT [FK_Workout_User]
FOREIGN KEY (UserID) REFERENCES Users(UserID);
Go

-- Create Exercises table
USE FitnessAppDB;
CREATE TABLE [dbo].[Exercises](
    [ExerciseID] [int] IDENTITY(1,1) NOT NULL,
    [Name] [varchar](100) NOT NULL,
	[Weight] [int] NULL,
	[Sets] [int] NULL,
	[Reps] [int] NULL,
	[WorkoutID] [int] NULL,
	[Date] [Date] NULL
);
GO

--Primary key constraint
USE FitnessAppDB;
ALTER TABLE Exercises
ADD CONSTRAINT [PK_Exercise] PRIMARY KEY CLUSTERED ([ExerciseID] ASC);
GO

--Forign Key constraint
USE FitnessAppDB;
ALTER TABLE Exercises
ADD CONSTRAINT [FK_Exercises_Workout]
FOREIGN KEY (WorkoutID) REFERENCES Workout(WorkoutID);
Go

-- Create Cardio table
USE FitnessAppDB;
CREATE TABLE [dbo].[Cardio](
    [CardioID] [int] IDENTITY(1,1) NOT NULL,
    [Name] [varchar](100) NOT NULL,
	[Distance] [int] NULL,
	[WorkoutID] [int] NULL,
	[Date] [Date] NULL
);
GO

--Primary key constraint
USE FitnessAppDB;
ALTER TABLE Cardio
ADD CONSTRAINT [PK_Cardio] PRIMARY KEY CLUSTERED ([CardioID] ASC);
GO

--Forign Key constraint
USE FitnessAppDB;
ALTER TABLE Cardio
ADD CONSTRAINT [FK_Cardio_Workout]
FOREIGN KEY (WorkoutID) REFERENCES Workout(WorkoutID);
Go