--Inserting data into the Users table
USE FitnesAppDB;
INSERT INTO [dbo].[Users]
           ([Email],
		   [Metric]
           )
VALUES ('slapstick42@gmal.com', 1),
('fortnight73@gmail.com', 0)
GO

--Inserting data into the Workout table
USE FitnesAppDB;
INSERT INTO [dbo].[Workout]
           ([Name],
		   [UserID],
		   [Date]
           )
VALUES ('wk1','1','2022-02-17'),
('wk2', '2','2022-02-18')
GO

--Inserting data into the Exercises table
USE FitnesAppDB;
INSERT INTO [dbo].[Exercises]
           ([Name],
		   [Weight],
		   [Sets],
		   [Reps],
		   [WorkoutID],
		   [Date]
           )
VALUES ('dumbbell presses','20','3','20','1','2022-02-17'),
('dumbbell presses','40','3','20','2','2022-02-18'),
('Squat','100','3','10','1','2022-02-17'),
('Squat','100','3','10','2','2022-02-18'),
('Bench press','50','4','8','1','2022-02-17'),
('Bench press','50','4','8','2','2022-02-18'),
('Deadlift','150','2','12','1','2022-02-17'),
('Deadlift','150','2','12','2','2022-02-18')
GO

--Inserting data into the Workout table
USE FitnesAppDB;
INSERT INTO [dbo].[Cardio]
           ([Name],
		   [Distance],
		   [WorkoutID],
		   [Date]
           )
VALUES ('walk','10','1','2022-02-17'),
('run', '5','2','2022-02-18')
GO