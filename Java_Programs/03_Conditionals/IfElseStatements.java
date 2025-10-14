public class IfElseStatements {
    public static void main(String[] args) {
        int age = 18;

        if (age >= 18) {
            System.out.println("You are an adult");
        } else {
            System.out.println("You are a minor");
        }

        int marks = 85;
        if (marks >= 90) {
            System.out.println("Grade A");
        } else if (marks >= 75) {
            System.out.println("Grade B");
        } else {
            System.out.println("Grade C");
        }
    }
}
