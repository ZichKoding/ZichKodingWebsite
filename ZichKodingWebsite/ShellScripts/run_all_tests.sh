# Run all Django tests
# Usage: ./run_all_tests.sh

# If the virtual environment is not activated, activate it
if [ -z "$VIRTUAL_ENV" ]; then
    echo "No virtual environment found. Activating virtual environment..."
    ./start_virtual_env.sh
else
    echo "Virtual environment is already active."
    exit 0
fi

# Run all tests
python manage.py test 2> test_results.txt

# Check if tests passed
if [ $? -eq 0 ]; then
    echo "All tests passed."
    echo "Deactivating virtual environment..."
    exit 0
else
    echo "Some tests failed. Check test_results.txt for more information."
    exit 1
fi